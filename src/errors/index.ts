export class NumAttemptError extends Error {
    public n_attempt: number;

    constructor(message: string, n_attempt: number) {
        super(message);
        this.n_attempt = n_attempt;
    }
}