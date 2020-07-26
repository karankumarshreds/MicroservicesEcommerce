import { Ticket } from '../ticket';

// Lecture 363
it('implements optimistic concurrency control', async (done) => {

    // create an instance of a ticket 
    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: '123'
    })

    // save the ticket 
    await ticket.save();

    // fetch the ticket twice, both will have the same version number
    const firstTimeFetchedTicket = await Ticket.findById(ticket.id);
    const secndTimeFetchedTicket = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets that we fetched
    await firstTimeFetchedTicket!.set({ price: 10 });
    await secndTimeFetchedTicket!.set({ price: 20 });

    // save the first fetched ticket (will have version: 1)
    await firstTimeFetchedTicket!.save();

    // save the second fetched ticket and expect an error because this secnd
    // instance still thinks and tries to save instance of version 1. But we 
    // have already changed it to version 2 because of previous step. Hence,
    // it would not find a ticket with ID and VERSION = 0;
    try {
        await secndTimeFetchedTicket!.save();
    } catch (err) {
        return done();
    }
    throw new Error('Should not reach this point');
    /**
     * @ERROR : No matching document found for id "5f1d6542c30c672f2422518f" version 0 modifiedPaths "price"
     */

});

it('increments the version numbers on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 500,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
});