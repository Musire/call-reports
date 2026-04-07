import { clsx } from "clsx";
import { Check, LoaderCircle } from "lucide-react";

type ActionTrayProps = {
    controls: {
        index: number;
        isFirst: boolean;
        isLast: boolean;
        onBack: () => void;
        onNext: () => void;
    }
    formState: {
        isSubmitting: boolean;
        showError: boolean;
        showSuccess: boolean;
    };
};

export default function ActionTray({ controls, formState }: ActionTrayProps) {
    const {
        isSubmitting,
        showError,
        showSuccess
    } = formState

    const  {
        index,
        isFirst,
        isLast,
        onNext,
        onBack
    } = controls


    return (
        <div 
            className="flex justify-end w-full"
        >
            {!isFirst && (
                <button 
                    type="button" 
                    onClick={onBack}
                    className="mr-auto hover:cursor-pointer"
                >
                Back
                </button>
            )}

            {!isLast && (
                <button
                    key='next-btn'
                    type="button" 
                    onClick={onNext}
                    className="hover:cursor-pointer"
                >
                    Next
                </button>
            )}
            <button
                type="submit"
                key='submit-btn'
                disabled={isSubmitting || showSuccess || !isLast} 
                className={clsx(
                "normal-space   rounded-lg snappy  font-medium flex items-center justify-center gap-x-2 text-lg mt-6 disabled:cursor-not-allowed",
                {
                    "bg-transparent hover:bg-whitesmoke text-whitesmoke/87 border-2 border-whitesmoke/40 hover:text-deep active:bg-whitesmoke active:text-deep ": !showError && !showSuccess && !isSubmitting,
                    "bg-error-dark border-error-dark text-deep": showError,
                    "bg-success-dark border-success-dark text-deep": showSuccess,
                    "hidden": !isLast,
                }
                )}
            >
                {isSubmitting && <LoaderCircle size={15} className="w-4 h-4 animate-spin" />}
                {showSuccess && !isSubmitting && <Check   className="w-6 h-6" />}
    
                {isSubmitting
                ? "Submitting..."
                : showError
                ? "Retry"
                : showSuccess
                ? "Success"
                : "Submit"}
            </button>
        </div>
    );
}


