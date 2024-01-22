import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!comment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(comment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questionComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(answerId: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerId)

    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    })
  }
}
