# iperf3-service

Iperf3 service with nodes callable by http API

See docker-compose.yml

## Example of use

- Run this app on node1
- Run this app on node2
- Call http://node1/node2 to get the result
- or call http://node2/node1 !

## Configuration

Please see index.js, "schema" section.

## Telegraf example

Example with two server node1 and node2, and telegraf in node1 with docker service with hostname iperf.

```
[[inputs.http]]
  name_override = "iperf"
  urls = [
    "http://iperf/node2"
  ]

  data_format = "json"
  tagexclude = ["url"]

  # https://gjson.dev/
  json_query = "{average_bps_sent:end.sum_sent.bits_per_second,average_bps_received:end.sum_received.bits_per_second}"

  [inputs.http.tags]
    target = "node2"

[[processors.converter]]
  [processors.converter.fields]
    namepass = ["iperf"]
    integer = ["average_bps_sent", "average_bps_received"]
```

### Compatibility / Impacts

- x86 and arm (Raspberry 3 & 4) compatible
- Relatively small Memory footprint (~ 23 MiB on x64)
- @todo reduce image size (294 MB vs 91 MB for node:12-alpine) -> probably node_modules black hole
