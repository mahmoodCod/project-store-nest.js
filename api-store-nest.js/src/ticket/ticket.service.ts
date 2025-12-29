import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
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

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { userId, replyTo, ...ticketDto } = createTicketDto;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User ${createTicketDto.userId} not found`);
    }

    const replyToTicket = await this.ticketRepository.findOneByOrFail({
      id: replyTo,
    });

    const ticket = this.ticketRepository.create({
      ...ticketDto,
      user,
      replyTo: replyToTicket,
    });

    return await this.ticketRepository.save(ticket);
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
