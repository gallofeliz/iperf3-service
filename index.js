const loadConfig = require('js-libs/config').default
const runProcess = require('js-libs/process').default
const createLogger = require('js-libs/logger').default
const { handleExitSignals } = require('js-libs/exit-handle')
const HttpServer = require('js-libs/http-server').default
const { once } = require('events')
const logger = createLogger('info')

const config = loadConfig({
    schema: {
        type: 'object',
        properties: {
            server: {
                type: 'object',
                properties: {
                    enabled: { type: 'boolean' }
                }
            },
            client: {
                type: 'object',
                properties: {
                    enabled: { type: 'boolean' },
                    http: {
                        type: 'object',
                        properties: {
                            port: { type: 'integer' }
                        }
                    }
                }
            },
            iperf: {
                type: 'object',
                properties: {
                    time: { type: 'integer' }
                }
            }
        }
    },
    defaultValues: {
        'server.enabled': true,
        'client.enabled': true,
        'client.http.port': 80,
        'iperf': {}
    }
})

logger.info('Loaded config', {config})

let iperfServerProcess
let httpServer

if (config.server.enabled) {
    logger.info('Starting server')
    iperfServerProcess = runProcess({
        cmd: 'iperf3',
        args: ['-s'],
        logger
    })
}

if (config.client.enabled) {
    logger.info('Starting client')
    httpServer = new HttpServer({
        logger,
        port: config.client.http.port,
        api: {
            routes: [{
                method: 'get',
                path: '/:host',
                async handler(req, res) {
                    const requestProcess = runProcess({
                        cmd: 'iperf3',
                        args: [
                            '--json',
                            '-c', req.params.host,
                            ...config.iperf.time ? ['-t', config.iperf.time.toString()]: []
                        ],
                        logger,
                        outputType: 'json'
                    })

                    const [result] = await once(requestProcess, 'finish')

                    res.json(result)
                }
            }]
        }
    })

    httpServer.start()
}


handleExitSignals(() => {
    iperfServerProcess && iperfServerProcess.abort()
    httpServer && httpServer.stop()
})
