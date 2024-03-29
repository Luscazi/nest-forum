import { FetchRecentAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { z } from 'zod'
import { AnswerWithAuthorPresenter } from '../presenters/answer-with-author-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchRecentAnswers: FetchRecentAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchRecentAnswers.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const answers = result.value.answers

    return {
      answers: answers.map(AnswerWithAuthorPresenter.toHttp),
    }
  }
}
