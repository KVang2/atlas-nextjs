import { AnswerForm } from "@/components/AnswerForm";
import { Answer } from "@/components/Answer";
import CorrectButton from "@/components/CorrectButton";
import { fetchQuestion, fetchAnswers } from "@/lib/data";
import { HashtagIcon } from "@heroicons/react/24/outline";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const question = await fetchQuestion(id);
  const answers = await fetchAnswers(id);

  if (!question) {
    return (
    <div>
        Question not found
    </div>
    );
  }

  const acceptedAnswer = answers.find((answer) => answer.isCorrect);
  const otherAnswers = answers.filter((answer) => !answer.isCorrect);

  return (
    <div>
      <h1 className="text-3xl font-black flex items-center">
        <HashtagIcon className="h-6 w-6 mr-2" /> {question.title}
      </h1>
      <AnswerForm questionId={question.id} />

      <div>
        {acceptedAnswer && (
          <Answer
            key={acceptedAnswer.id}
            id={acceptedAnswer.id}
            text={acceptedAnswer.text}
            votes={acceptedAnswer.votes}
            isCorrect={true}
            question_id={acceptedAnswer.question_id}
          />
        )}

        {otherAnswers.length > 0 ? (
          otherAnswers.map((answer) => (
            <div key={answer.id}>
                <Answer
                    key={answer.id}
                    id={answer.id}
                    text={answer.text}
                    votes={answer.votes}
                    question_id={answer.question_id}
                    isCorrect={false}
            />
            <CorrectButton id={answer.id} isCorrect={false} votes={0} />
            </div>
          ))
        ) : (
          <p className="mt-4 text-gray-500">No answers submitted yet.</p>
        )}
      </div>
    </div>
  );
}