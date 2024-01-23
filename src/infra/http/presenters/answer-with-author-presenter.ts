import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

export class AnswerWithAuthorPresenter {
  static toHttp(answerWithAuthor: AnswerWithAuthor) {
    return {
      id: answerWithAuthor.answerId.toString(),
      authorId: answerWithAuthor.authorId.toString(),
      authorName: answerWithAuthor.author,
      content: answerWithAuthor.content,
      createdAt: answerWithAuthor.createdAt,
      updatedAt: answerWithAuthor.updatedAt,
    }
  }
}
