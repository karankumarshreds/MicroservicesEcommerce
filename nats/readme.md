##### Keywords: 
  - Channel/Topic/Subject: TYPES of events that we will be listening to inside the services

*example*: If we make a new event, say ticket:updated, we will send that event using node-natstreaming library to the NAT Streaming server's "ticket:updated Channel".
Then NAT will publish that event to the other services(only the ones which are listening for that channel).

 - Subscription: The services which want to listen to the type of events need to subscribe to that Channel.

 - NAT Streaming Server State: NATS stores all the events in memory(default), flat files or in a MySQL/Postgres DB(separate).

#### MAIN COMPONENTS

 - Publisher: Program which publishes the event to the NAT server. 

*Publisher contains:* 
 1) Data (known as message) // *CAN ONLY BE STRING or JSON, CAN'T BE AN OBJECT*
 2) Subject: *Name of the Channel to which the event will be published*

NAT server will add the channel/subject to it's list of channel(if it doesn't already exist). It will take the data attached to it and will broadcast it to anyone listening for this channel.
  - Listener: Programs which listens to the event from the NAT server.

*Listener contains:* 
1) Subject: *While creating a listener, we need to specify the Subject(channel) that we wanna listen to.*
2) Subscription: Then the stan client(NAT npm module instance) will make use of subscription to reach out for the event(data) and get it from the NAT server.

#### QUEUE GROUP 
In the NAT streaming server, we have a queue group. We can have multiple queue groups hooked upto a same channel. 
Suppose we have two instances(replicas) of the same listener service, we'd only want one of them to act upon the new event in order to avoid event query duplication. *For example, if a service adds a comment, if both services acted on it, there would be two identical comments*.

So, both the services will create a subscription to the queue group of the *Channel*. NOW, if the NAT server gets an event for the Channel, say ticket:created, it would check the queue groups affiliated to the Channel(ticket:created) and throw that event to any random(only 1) service(listener) in every queue group.

  