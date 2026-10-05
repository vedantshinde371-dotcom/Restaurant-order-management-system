import React, { useState } from 'react';
import {
  CheckCircleIcon,
  FlameIcon,
  ClockIcon,
  ChefHatIcon,
  UtensilsIcon,
  ArrowRightIcon,
} from './Icons';
import type { ActiveOrder } from '../data/mockRestaurantData';
import type { OrderType } from './CustomerNavbar';

interface OrderTrackerSectionProps {
  order: ActiveOrder;
  orderType?: OrderType;
  onCallWaiter: () => void;
  onBrowseMenu: () => void;
  onStepAdvance?: (nextStep: 1 | 2 | 3 | 4) => void;
}

export const OrderTrackerSection: React.FC<OrderTrackerSectionProps> = ({
  order,
  orderType,
  onCallWaiter,
  onBrowseMenu,
  onStepAdvance,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(order.currentStep);

  // An order is Home Delivery if explicitly marked delivery, has Delivery in tableNumber,
  // or has the default 'Table 04' fallback without explicit table booking, or matches SAV-7080
  const isDelivery =
    order.orderType === 'delivery' ||
    orderType === 'delivery' ||
    order.tableNumber.toLowerCase().includes('delivery') ||
    order.tableNumber === 'Table 04' ||
    order.id === 'SAV-7080' ||
    !order.tableNumber;

  const steps = [
    { num: 1, title: 'Order Received', desc: 'Validated & queued' },
    { num: 2, title: 'Cooking on Line', desc: 'Executive Chef prep' },
    { num: 3, title: 'On the Way to Deliver', desc: 'Order is out for delivery' },
    { num: 4, title: 'Delivery Received', desc: 'Order delivered successfully' },
  ];

  const handleSimulateNextStep = () => {
    const next = currentStep < 4 ? ((currentStep + 1) as 1 | 2 | 3 | 4) : 1;
    setCurrentStep(next);
    if (onStepAdvance) onStepAdvance(next);
  };

  return (
    <section className="order-tracker-panel" aria-label="Current Order Status">
      <div className="tracker-card">
        {/* Tracker Header */}
        <div className="tracker-header">
          <div className="tracker-title-group">
            <div className="live-status-pill">
              <span className="live-pulse-dot" />
              <span>{isDelivery ? 'DELIVERY TRACKER' : 'LIVE KITCHEN TRACKER'}</span>
            </div>

            <h3 className="tracker-heading">
              Order {order.id}
              {!isDelivery && <span className="tracker-table-tag">{order.tableNumber}</span>}
            </h3>

            {!isDelivery && (
              <p className="tracker-timestamp">
                Placed at {order.placedTime} • Service: Dinner Dining
              </p>
            )}
          </div>

          <div className="tracker-eta-badge">
            <ClockIcon size={16} />
            <div className="eta-text-col">
              <span className="eta-number">
                {currentStep === 4 ? 'Arrived!' : `${order.estimatedMinutes} mins`}
              </span>
              <span className="eta-label">
                {currentStep === 4 ? 'Enjoy your meal' : 'Estimated Arrival'}
              </span>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Visual Stepper */}
        <div className="tracker-stepper">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                className={`tracker-step-node ${isCompleted ? 'completed' : ''} ${
                  isCurrent ? 'current' : ''
                }`}
              >
                <div className="step-circle-badge">
                  {isCompleted ? (
                    <CheckCircleIcon size={18} />
                  ) : isCurrent ? (
                    <FlameIcon size={18} className="anim-flame" />
                  ) : (
                    <span>{s.num}</span>
                  )}
                </div>
                <div className="step-label-group">
                  <span className="step-title">{s.title}</span>
                  <span className="step-sub">{s.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Kitchen Status Announcement & Demo Button - Completely removed for Home Delivery */}
        {!isDelivery && (
          <div className="tracker-status-box">
            <div className="status-box-icon">
              <ChefHatIcon size={20} />
            </div>
            <div className="status-box-text">
              <strong>Current Kitchen Status:</strong>{' '}
              {currentStep === 1 && 'Order received at KDS station. Ingredients allocated.'}
              {currentStep === 2 && order.statusText}
              {currentStep === 3 && 'Chef is inspecting sauce reduction and garnishing plates.'}
              {currentStep === 4 && 'Dishes served by Server Marco. Bon appétit!'}
            </div>
            <button
              type="button"
              className="sim-step-btn"
              onClick={handleSimulateNextStep}
              title="Simulate Next Kitchen Stage"
            >
              Advance Stage (Demo)
            </button>
          </div>
        )}

        {/* Items summary and quick actions */}
        <div className="tracker-footer-row">
          <div className="tracker-dishes-summary">
            <span className="dishes-count-label">
              Dishes in this ticket ({order.items.reduce((s, i) => s + i.quantity, 0)} items):
            </span>
            <div className="dishes-chips-list">
              {order.items.map((item, idx) => (
                <span key={idx} className="dish-chip">
                  <UtensilsIcon size={12} />
                  <strong>{item.quantity}×</strong> {item.name}
                </span>
              ))}
            </div>
          </div>

          <div className="tracker-actions">
            {isDelivery ? (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onCallWaiter}
              >
                Call Delivery Person
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={onCallWaiter}
                >
                  Call Waiter / Refill
                </button>
                <button
                  type="button"
                  className="btn btn-cognac btn-sm"
                  onClick={onBrowseMenu}
                >
                  <span>Add More Dishes</span>
                  <ArrowRightIcon size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
