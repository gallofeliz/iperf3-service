//const loadConfig = require('js-libs/config').default
const runProcess = require('js-libs/process').default
const createLogger = require('js-libs/logger').default
const { handleExitSignals } = require('js-libs/exit-handle')
const HttpServer = require('js-libs/http-server').default
const { once } = require('events')
const logger = createLogger('info')

const iperfServerProcess = runProcess({
    cmd: 'iperf3',
    args: ['-s'],
    logger
})

const httpServer = new HttpServer({
    logger,
    port: 80,
    api: {
        routes: [{
            method: 'get',
            path: '/:host',
            async handler(req, res) {
                const requestProcess = runProcess({
                    cmd: 'iperf3',
                    args: ['--json', '-c', req.params.host, '-t', '2'],
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

handleExitSignals(() => {
    iperfServerProcess.abort()
    httpServer.stop()
})
