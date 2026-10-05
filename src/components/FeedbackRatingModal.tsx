import React, { useState } from 'react';
import type { ActiveOrder, OrderRating } from '../data/mockRestaurantData';
import {
  CloseIcon,
  StarIcon,
  SparklesIcon,
  CheckCircleIcon,
  MessageSquareIcon,
} from './Icons';

interface FeedbackRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ActiveOrder | null;
  onSubmitRating: (orderId: string, rating: OrderRating) => void;
}

const COMPLIMENT_TAGS = [
  'Perfect Temperature',
  'Exquisite Presentation',
  'Aromatic Truffle Notes',
  'Prompt & Polite Courier',
  'Flawless Steak Doneness',
  'Premium Eco Packaging',
];

interface StarRatingInputProps {
  label: string;
  sublabel: string;
  rating: number;
  onChange: (value: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  label,
  sublabel,
  rating,
  onChange,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating-row-card">
      <div className="star-rating-info">
        <span className="star-rating-title">{label}</span>
        <span className="star-rating-subtitle">{sublabel}</span>
      </div>

      <div className="interactive-stars-wrap">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverRating || rating) >= star;
          return (
            <button
              key={star}
              type="button"
              className={`interactive-star-btn ${isFilled ? 'filled' : ''}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => onChange(star)}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <StarIcon size={22} />
            </button>
          );
        })}
        <span className="star-value-label">
          {(hoverRating || rating) > 0 ? `${hoverRating || rating} / 5` : 'Rate'}
        </span>
      </div>
    </div>
  );
};

export const FeedbackRatingModal: React.FC<FeedbackRatingModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmitRating,
}) => {
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [overallRating, setOverallRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Perfect Temperature', 'Exquisite Presentation']);
  const [writtenFeedback, setWrittenFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overallRating === 0) return;

    const fullComment = writtenFeedback.trim()
      ? `${selectedTags.length > 0 ? `[${selectedTags.join(', ')}] ` : ''}${writtenFeedback.trim()}`
      : selectedTags.length > 0
      ? `Highlights: ${selectedTags.join(', ')}`
      : 'Exceptional dining experience.';

    const now = new Date();
    const formattedDate = `Today, ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

    const ratingRecord: OrderRating = {
      food: foodRating,
      service: serviceRating,
      overall: overallRating,
      comment: fullComment,
      submittedAt: formattedDate,
    };

    onSubmitRating(order.id, ratingRecord);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="feedback-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Rate order ${order.id}`}
      >
        <div className="feedback-modal-header">
          <div className="feedback-header-left">
            <div className="feedback-tag-pill">
              <SparklesIcon size={14} />
              <span>SAVORIA GUEST SATISFACTION</span>
            </div>
            <h2 className="feedback-modal-title">Rate Your Culinary Experience</h2>
            <p className="feedback-order-ref">
              Order {order.id} • {order.items.map((i) => i.name).slice(0, 2).join(', ')}
              {order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}
            </p>
          </div>
          <button
            type="button"
            className="feedback-close-btn"
            onClick={onClose}
            aria-label="Close review dialog"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="feedback-success-state">
            <div className="success-icon-bubble">
              <CheckCircleIcon size={36} />
            </div>
            <h3>Thank You for Your Feedback!</h3>
            <p>
              Your review for order <strong>{order.id}</strong> has been received by Executive Chef Marco and our guest hospitality team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form-body">
            {/* Rating Controls: Food, Service, Overall */}
            <div className="ratings-sliders-container">
              <StarRatingInput
                label="Food & Flavor Quality"
                sublabel="Taste, seasoning, tenderness, artisanal presentation"
                rating={foodRating}
                onChange={setFoodRating}
              />

              <StarRatingInput
                label="Service & Delivery Speed"
                sublabel="Promptness, courier care, temperature preservation"
                rating={serviceRating}
                onChange={setServiceRating}
              />

              <StarRatingInput
                label="Overall Dining Experience"
                sublabel="Your overall culinary satisfaction with SAVORIA"
                rating={overallRating}
                onChange={setOverallRating}
              />
            </div>

            {/* Quick Compliment Badges */}
            <div className="feedback-section-block">
              <span className="feedback-input-label">What stood out most?</span>
              <div className="compliments-chips-grid">
                {COMPLIMENT_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`compliment-chip ${active ? 'active' : ''}`}
                      onClick={() => handleToggleTag(tag)}
                    >
                      {active ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Comments */}
            <div className="feedback-section-block">
              <label htmlFor="written-comments" className="feedback-input-label">
                <MessageSquareIcon size={14} />
                <span>Written Feedback & Chef Comments (Optional)</span>
              </label>
              <textarea
                id="written-comments"
                className="feedback-textarea"
                rows={3}
                placeholder="Share your impressions on the sauce reductions, steak crust, pasta texture, or courier service..."
                value={writtenFeedback}
                onChange={(e) => setWrittenFeedback(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="feedback-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-cognac btn-lg submit-review-btn"
                disabled={overallRating === 0}
              >
                <StarIcon size={16} />
                <span>Submit Dining Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
