import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UserService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const { userId, replyTo, ...ticketDto } = createTicketDto;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User ${createTicketDto.userId} not found`);
    }

    let replyToTicket: Ticket | undefined;
    if (replyTo) {
      const foundTicket = await this.ticketRepository.findOne({
        where: { id: replyTo },
        relations: ['replyTo'],
      });
      if (!foundTicket) {
        throw new NotFoundException(`Ticket ${replyTo} not found`);
      }
      if (foundTicket.replyTo) {
        throw new BadRequestException('Reply to ticket is already a reply');
      }
      replyToTicket = foundTicket;
    }

    const ticket = this.ticketRepository.create({
      ...ticketDto,
      user,
      ...(replyToTicket && { replyTo: replyToTicket }),
    });

    return await this.ticketRepository.save(ticket);
  }

  async findAll() {
    const ticket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.replyTo Is Null')
      .getMany();

    return ticket;
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['replies', 'replyTo'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} not found !!`);
    }

    return ticket;
  }
}
