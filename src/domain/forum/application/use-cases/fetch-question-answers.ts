import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AnswerWithAuthor } from '../../enterprise/entities/value-objects/answer-with-author'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchAnswersUseCaseResponse = Either<
  null,
  {
    answers: AnswerWithAuthor[]
  }
>

@Injectable()
export class FetchRecentAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchAnswersUseCaseRequest): Promise<FetchAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionIdWithAuthor(
      questionId,
      { page },
    )

    return right({ answers })
  }
}
