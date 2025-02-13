import CorrectButton from "./CorrectButton";
import VoteButton from "./VoteButton";

type AnswerProps = {
    id: string;
    question_id: string;
    text: string;
    votes: number;
    isCorrect: boolean;
};

export function Answer({
    id,
    text,
    votes,
    isCorrect }: AnswerProps) {
    return (
        <div>
            <div>{votes}</div>
            <p>{text}</p>
            <div>
                <VoteButton id={id} />
                <CorrectButton id={id} isCorrect={isCorrect} votes={votes} />
            </div>
        </div>
    );
}