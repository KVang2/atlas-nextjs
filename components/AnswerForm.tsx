import { addAnswer } from "@/lib/actions";

export function AnswerForm({ questionId }: { questionId: string }) {
  return (
    <form className="p-4 mt-2 border rounded-lg shadow-md w-full" action={addAnswer}>
      <input type="hidden" name="question_id" value={questionId} />

      <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
        Answer:
      </label>

      <textarea
        id="answer"
        name="answer"
        placeholder="Type your answer here..."
        className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="flex h-10 w-24 items-center justify-center rounded-md border bg-secondary px-4 text-lg text-white focus:bg-secondary"
      >
        Answer
      </button>
    </form>
  );
}
