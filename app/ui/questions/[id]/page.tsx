import { fetchQuestions } from "@/lib/data";
import AnswerForm from "@/components/AnswerForm";
import AnswerList from "@/components/AnswerList";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const questions = await fetchQuestions(params.id);

  if (!questions || questions.length === 0) {
    return <div>Question not found</div>;
  }

  const question = questions[0];

  return (
    <div>
        <h1>{question.id}</h1>
        <p>{question.title}</p>

        <AnswerForm questionId={params.id} />

        <AnswerList questionId={params.id} />
    </div>
  );
}