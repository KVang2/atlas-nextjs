import { sql } from "@vercel/postgres";
import { Question, Topic, User, Answer } from "./definitions";

export async function fetchUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchTopics() {
  try {
    const data = await sql<Topic>`SELECT * FROM topics`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchTopic(id: string) {
  try {
    const data = await sql<Topic>`SELECT * FROM topics WHERE id = ${id}`;
    return data.rows && data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchQuestions(id: string) {
  try {
    const data =
      await sql<Question>`SELECT * FROM questions WHERE topic_id = ${id} ORDER BY votes DESC`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch questions.");
  }
}

export async function fetchQuestion(id: string): Promise<Question | null> {
  try {
    const result = await sql<Question[]>`
    SELECT id, title, topic_id, votes, answer_id
    FROM questions
    WHERE id = ${id};`;

    return (result.rows.length > 0 ? result.rows[0] : null) as Question | null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch question.");
  }
}

export async function insertQuestion(
  question: Pick<Question, "title" | "topic_id" | "votes">
) {
  try {
    const data =
      await sql<Question>`INSERT INTO questions (title, topic_id, votes) VALUES (${question.title}, ${question.topic_id}, ${question.votes})`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add question.");
  }
}

export async function fetchAnswers(questionId: string) {
  try {
    const result = await sql<Answer>`
      SELECT id, answer AS text, question_id, votes, is_correct AS isAccepted
      FROM answers
      WHERE question_id = ${questionId} 
      ORDER BY is_correct DESC, votes DESC;
    `;

    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function insertAnswer(
  answer: Pick<Answer, "text" | "question_id">
) {
  try {
    const data = await sql<Answer[]>`
      INSERT INTO answers (answer, question_id)
      VALUES (${answer.text}, ${answer.question_id})
      RETURNING *;`;

    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add answer.");
  }
}

export async function insertTopic(topic: Pick<Topic, "title">) {
  try {
    const data =
      await sql<Topic>`INSERT INTO topics (title) VALUES (${topic.title}) RETURNING id;`;
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add topic.");
  }
}

export async function incrementVotes(id: string) {
  try {
    const data =
      await sql<Question>`UPDATE questions SET votes = votes + 1 WHERE id = ${id}`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to increment votes.");
  }
}

export async function markAnswerAsCorrect(answerId: string) {
   try {
    const result = await sql`
      UPDATE answers
      SET is_correct = TRUE
      WHERE id = ${answerId}
      RETURNING *;`;

    if (result.rowCount === 0) throw new Error("Answer not found.");

    return { success: true, updated: result.rows[0] };
  } catch (error) {
    console.error("Error in markAnswerAsCorrect:", error);
    throw new Error("Failed to mark answer as correct.");
  }
}

export async function markAnswerAsAccepted(answerId: string) {
  try {
    const result = await sql`
      SELECT question_id FROM answers WHERE id = ${answerId};
    `;

    if (result.rows.length === 0) {
      throw new Error("Answer not found.");
    }

    const questionId = result.rows[0].question_id;

    await sql`
      UPDATE answers
      SET is_correct = FALSE WHERE question_id = ${questionId};
    `;
  
    await sql`
      UPDATE answers
      SET is_correct = TRUE WHERE id = ${answerId}
    `;

    return { success: true, questionId };
  } catch (error) {
    console.error("Database Error in markAnswerAsAccepted:", error);
    throw new Error("Failed to mark answer as accepted.");
  }
}
