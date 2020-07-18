/**
 * We are keeping the possible channel names here in 
 * a  single file such that whenever they're accessed
 * we 'dont' accidentally do any sort of Typo 
 */

export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderUpdated = 'order:updated'
}

// eg : Subjects.TicketCreated
