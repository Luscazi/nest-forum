import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((x) => x.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const answers = this.items
      .filter((x) => x.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((answer) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(answer.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${answer.authorId.toString()}" does not exist.`,
          )
        }

        return AnswerWithAuthor.create({
          authorId: answer.authorId,
          author: author.name,
          answerId: answer.id,
          content: answer.content,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })
      })

    return answers
  }

  async save(answer: Answer) {
    const index = this.items.findIndex((x) => x.id === answer.id)

    if (index === -1) return

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    this.items[index] = answer

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async create(answer: Answer) {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((x) => x.id === answer.id)

    if (index === -1) return

    this.items.splice(index, 1)
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
