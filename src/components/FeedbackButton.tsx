import { useState } from "react";

const GOOGLE_REVIEW_URL = "https://g.page/r/CQwQwQwQwQwQwE0/review"; // Replace with your real Google Maps review link

const FeedbackButton = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-irish-gold text-irish-red font-bold px-6 py-4 rounded-full shadow-lg flex items-center gap-2 text-lg hover:bg-irish-gold/90 transition-all border-2 border-irish-red"
        onClick={() => setShow(true)}
        aria-label="Leave a review"
      >
        <span role="img" aria-label="star">
          🌟
        </span>{" "}
        Feedback
      </button>
      {show && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-2xl text-irish-red hover:text-irish-gold"
              onClick={() => setShow(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold font-serif mb-4 text-irish-red text-center">
              We'd love your feedback!
            </h3>
            <p className="text-gray-700 mb-6 text-center">
              Share your experience and help others discover D'Arcy McGee's.
              Your review means a lot to us!
            </p>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-irish-gold hover:bg-irish-gold/90 text-irish-red font-bold text-lg py-3 rounded-lg shadow text-center border-2 border-irish-red transition-all"
            >
              Leave a Google Review
            </a>
            <p className="text-xs text-gray-400 mt-4 text-center">
              You will be redirected to Google Maps to leave your review.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
