/* eslint-disable @typescript-eslint/no-empty-function */
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error.js'
import { makeQuestionComment } from 'test/factories/make-question-comment.js'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository.js'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository.js'
import { DeleteQuestionCommentUseCase } from './delete-question-comment.js'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository,
    )
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment()

    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
