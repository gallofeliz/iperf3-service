# iperf3-service

Iperf3 service with nodes callable by http API

See docker-compose.yml

For the moment, each node is a server and client.

- Run this app on node1
- Run this app on node2
- Call http://node1/node2 to get the result
- or call http://node2/node1 !

If needed, we can add feature flags to run only server or client part (for example is you have masterNode and slaveNode1, slaveNode2, you maybe want to have servers on slaves and client on master)

Configuration can be added to configure that, ports, logs, etc
