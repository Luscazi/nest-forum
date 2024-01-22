import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers.repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments.repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions.repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students.repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    QuestionCommentRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswerCommentRepository,
    AnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
