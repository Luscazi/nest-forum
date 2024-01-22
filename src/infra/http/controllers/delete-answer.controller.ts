import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer.ts'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const authorId = user.sub

    await this.deleteAnswer.execute({
      authorId,
      answerId,
    })
  }
}
