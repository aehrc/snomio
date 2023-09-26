import axios from 'axios';
import {
  AdditionalFieldType,
  Comment,
  Iteration,
  LabelType,
  PagedTicket,
  PriorityBucket,
  State,
  Ticket,
} from '../types/tickets/ticket';

const TicketsService = {
  // TODO more useful way to handle errors? retry? something about tasks service being down etc.

  handleErrors: () => {
    throw new Error('invalid ticket response');
  },
  async getIndividualTicket(id: number): Promise<Ticket> {
    const response = await axios.get(`/api/tickets/${id}`);
    if (response.status != 200) {
      this.handleErrors();
    }
    return response.data as Ticket;
  },
  async getPaginatedTickets(page: number, size: number): Promise<PagedTicket> {
    const pageAndSize = `page=${page}&size=${size}`;
    const response = await axios.get('/api/tickets?' + pageAndSize);
    if (response.status != 200) {
      this.handleErrors();
    }
    const pagedResponse = response.data as PagedTicket;
    return pagedResponse;
  },
  async updateTicketState(ticket: Ticket): Promise<Ticket> {
    const response = await axios.put(
      `/api/tickets/${ticket.id}/state/${ticket.state.id}`,
      ticket,
    );
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Ticket;
  },
  async updateTicketIteration(ticket: Ticket): Promise<Ticket> {
    const response = await axios.put(
      `/api/tickets/${ticket.id}/iteration/${ticket.iteration.id}`,
      ticket,
    );
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Ticket;
  },
  async updateTicketPriority(ticket: Ticket, id: number): Promise<Ticket> {
    const response = await axios.put(
      `/api/tickets/${ticket.id}/priorityBucket/${id}`,
      ticket,
    );
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Ticket;
  },
  async addTicketLabel(id: string, labelId: number) {
    const response = await axios.post(`/api/tickets/${id}/labels/${labelId}`);
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Ticket;
  },
  async addTicketComment(ticketId: number, content: string): Promise<Comment> {
    const response = await axios.post(`/api/tickets/${ticketId}/comments`, {
      text: content,
    });
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Comment;
  },
  async deleteTicketComment(commentId: number, ticketId: number) {
    const response = await axios.delete(
      `/api/tickets/${ticketId}/comments/${commentId}`,
    );
    if (response.status != 200) {
      this.handleErrors();
    }
    return response;
  },
  async deleteTicketLabel(id: string, labelId: number) {
    const response = await axios.delete(`/api/tickets/${id}/labels/${labelId}`);
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Ticket;
  },
  async updateAssignee(ticket: Ticket): Promise<Ticket> {
    const response = await axios.put(
      `/api/tickets/${ticket.id}/assignee/${ticket.assignee}`,
      ticket,
    );
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Ticket;
  },
  async updateAdditionalFieldTypeValue(
    ticketId: number,
    additionalFieldId: number,
  ): Promise<Ticket> {
    const response = await axios.post(
      `/api/tickets/${ticketId}/additionalField/${additionalFieldId}`,
    );
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Ticket;
  },
  async getAllStates(): Promise<State[]> {
    const response = await axios.get('/api/tickets/state');
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as State[];
  },
  async getAllPriorityBuckets(): Promise<PriorityBucket[]> {
    const response = await axios.get('/api/tickets/priorityBuckets');
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as PriorityBucket[];
  },
  async getAllLabelTypes(): Promise<LabelType[]> {
    const response = await axios.get('/api/tickets/labelType');
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as LabelType[];
  },
  async getAllIterations(): Promise<Iteration[]> {
    const response = await axios.get('/api/tickets/iterations');
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as Iteration[];
  },
  async getAllAdditionalFields(): Promise<AdditionalFieldType[]> {
    const response = await axios.get('/api/tickets/additionalFieldTypes');
    if (response.status != 200) {
      this.handleErrors();
    }

    return response.data as AdditionalFieldType[];
  },
};

export default TicketsService;
