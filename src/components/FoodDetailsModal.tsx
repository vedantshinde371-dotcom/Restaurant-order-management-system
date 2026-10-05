import React, { useState, useMemo } from 'react';
import type {
  Dish,
  DishPortion,
  SelectedCustomization,
  CartItem,
} from '../data/mockRestaurantData';
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  StarIcon,
  ClockIcon,
  FlameIcon,
  UtensilsIcon,
  AlertTriangleIcon,
  CheckIcon,
} from './Icons';

interface FoodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  initialCartItem?: CartItem | null;
  onSaveItem: (itemPayload: {
    dish: Dish;
    quantity: number;
    selectedPortion: DishPortion;
    selectedCustomizations: SelectedCustomization[];
    specialInstructions: string;
    unitPrice: number;
    existingItemId?: string;
  }) => void;
}

interface FoodDetailsModalContentProps {
  dish: Dish;
  initialCartItem?: CartItem | null;
  onClose: () => void;
  onSaveItem: FoodDetailsModalProps['onSaveItem'];
}

const getInitialPortion = (dish: Dish, initialCartItem?: CartItem | null): DishPortion | null => {
  if (initialCartItem && initialCartItem.dish.id === dish.id && initialCartItem.selectedPortion) {
    return initialCartItem.selectedPortion;
  }
  return dish.portions[0] || null;
};

const getInitialCustomizations = (
  dish: Dish,
  initialCartItem?: CartItem | null
): { [groupId: string]: string[] } => {
  if (initialCartItem && initialCartItem.dish.id === dish.id && initialCartItem.selectedCustomizations) {
    const map: { [groupId: string]: string[] } = {};
    dish.customizations.forEach((group) => {
      const matched = initialCartItem.selectedCustomizations?.find(
        (c) => c.groupName === group.name
      );
      map[group.id] = matched ? matched.optionNames : [];
    });
    return map;
  }
  const defaultMap: { [groupId: string]: string[] } = {};
  dish.customizations.forEach((group) => {
    if (group.type === 'single' && group.options.length > 0) {
      defaultMap[group.id] = [group.options[0].name];
    } else {
      defaultMap[group.id] = [];
    }
  });
  return defaultMap;
};

const FoodDetailsModalContent: React.FC<FoodDetailsModalContentProps> = ({
  dish,
  initialCartItem,
  onClose,
  onSaveItem,
}) => {
  const [selectedPortion, setSelectedPortion] = useState<DishPortion | null>(() =>
    getInitialPortion(dish, initialCartItem)
  );
  const [customizationSelections, setCustomizationSelections] = useState<{
    [groupId: string]: string[];
  }>(() => getInitialCustomizations(dish, initialCartItem));
  const [quantity, setQuantity] = useState(() =>
    initialCartItem && initialCartItem.dish.id === dish.id ? initialCartItem.quantity : 1
  );
  const [specialInstructions, setSpecialInstructions] = useState(() =>
    initialCartItem && initialCartItem.dish.id === dish.id
      ? initialCartItem.specialInstructions || ''
      : ''
  );

  // Handle single option change
  const handleSingleSelect = (groupId: string, optionName: string) => {
    setCustomizationSelections((prev) => ({
      ...prev,
      [groupId]: [optionName],
    }));
  };

  // Handle multi option change
  const handleMultiToggle = (groupId: string, optionName: string) => {
    setCustomizationSelections((prev) => {
      const current = prev[groupId] || [];
      const exists = current.includes(optionName);
      return {
        ...prev,
        [groupId]: exists ? current.filter((item) => item !== optionName) : [...current, optionName],
      };
    });
  };

  // Calculate live dynamic prices
  const { unitPrice, totalPrice, formattedCustomizations } = useMemo(() => {
    let extraPortion = selectedPortion ? selectedPortion.priceModifier : 0;
    let extraCustomizations = 0;
    const formatted: SelectedCustomization[] = [];

    dish.customizations.forEach((group) => {
      const selected = customizationSelections[group.id] || [];
      if (selected.length > 0) {
        let groupCost = 0;
        selected.forEach((optName) => {
          const opt = group.options.find((o) => o.name === optName);
          if (opt) groupCost += opt.price;
        });
        extraCustomizations += groupCost;
        formatted.push({
          groupName: group.name,
          optionNames: selected,
          additionalPrice: groupCost,
        });
      }
    });

    const calculatedUnit = +(dish.price + extraPortion + extraCustomizations).toFixed(2);
    const calculatedTotal = +(calculatedUnit * quantity).toFixed(2);

    return {
      unitPrice: calculatedUnit,
      totalPrice: calculatedTotal,
      formattedCustomizations: formatted,
    };
  }, [dish, selectedPortion, customizationSelections, quantity]);

  const handleSave = () => {
    onSaveItem({
      dish,
      quantity,
      selectedPortion: selectedPortion || dish.portions[0],
      selectedCustomizations: formattedCustomizations,
      specialInstructions,
      unitPrice,
      existingItemId: initialCartItem?.id,
    });
    onClose();
  };

  return (
    <div
      className="food-details-modal"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={`Details and Customization for ${dish.name}`}
    >
      {/* Modal Header */}
      <div className="food-modal-header">
        <div className="food-modal-badges">
          <span className="food-category-badge">
            <UtensilsIcon size={13} />
            <span>{dish.category.toUpperCase()}</span>
          </span>
          {dish.badge && <span className="food-custom-badge">{dish.badge}</span>}
          {dish.isVegetarian && (
            <span className="food-veg-badge" title="Vegetarian">
              🌱 Vegetarian
            </span>
          )}
        </div>
        <button
          type="button"
          className="food-modal-close-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      {/* Modal Scrollable Body */}
      <div className="food-modal-body">
        {/* Dish Image & Meta */}
        <div className="food-hero-media">
          <img src={dish.image} alt={dish.name} className="food-hero-img" />
          <div className="food-hero-overlay">
            <div className="food-meta-capsules">
              <span className="capsule">
                <StarIcon size={13} />
                <strong>{dish.rating}</strong> ({dish.reviewsCount} reviews)
              </span>
              <span className="capsule">
                <ClockIcon size={13} />
                {dish.prepTimeMinutes} mins prep
              </span>
              {dish.calories && (
                <span className="capsule">
                  <FlameIcon size={13} />
                  {dish.calories} kcal
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="food-info-section">
          <div className="food-title-row">
            <h2 className="food-modal-title">{dish.name}</h2>
            <div className="food-base-price">
              <span className="currency">$</span>
              <span className="amount">{dish.price.toFixed(2)}</span>
              <small>base</small>
            </div>
          </div>
          <p className="food-modal-desc">{dish.description}</p>
        </div>

        {/* Section: Ingredients */}
        <div className="food-section-block">
          <h4 className="food-section-heading">Fresh Artisan Ingredients</h4>
          <div className="ingredients-chips-list">
            {dish.ingredients.map((ing, idx) => (
              <span key={idx} className="ingredient-chip">
                • {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Section: Dietary & Allergens Alert */}
        <div className="food-section-block dietary-block">
          <div className="dietary-tags-row">
            <span className="dietary-label">Dietary:</span>
            {dish.dietary.map((d, idx) => (
              <span key={idx} className="diet-tag">
                ✓ {d}
              </span>
            ))}
          </div>

          {dish.allergens.length > 0 && (
            <div className="allergen-alert-box">
              <AlertTriangleIcon size={16} className="allergen-icon" />
              <div>
                <strong>Allergen Notice:</strong> Contains{' '}
                <span className="allergen-list">{dish.allergens.join(', ')}</span>.
              </div>
            </div>
          )}
        </div>

        {/* Section: Portions */}
        {dish.portions.length > 0 && (
            <div className="food-section-block">
              <div className="food-section-title-wrap">
                <h4 className="food-section-heading">Choose Portion Size</h4>
                <span className="section-req-pill">Required</span>
              </div>
              <div className="portion-cards-grid">
                {dish.portions.map((portion) => {
                  const isSelected = selectedPortion?.id === portion.id;
                  return (
                    <button
                      key={portion.id}
                      type="button"
                      className={`portion-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedPortion(portion)}
                    >
                      <div className="portion-card-left">
                        <span className={`portion-radio ${isSelected ? 'active' : ''}`}>
                          {isSelected && <span className="portion-radio-dot" />}
                        </span>
                        <div>
                          <div className="portion-name">{portion.name}</div>
                          {portion.description && (
                            <div className="portion-desc">{portion.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="portion-card-price">
                        {portion.priceModifier > 0
                          ? `+$${portion.priceModifier.toFixed(2)}`
                          : 'Included'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        {/* Section: Customizations */}
        {dish.customizations.map((group) => {
          const currentSelected = customizationSelections[group.id] || [];

          return (
            <div key={group.id} className="food-section-block">
              <div className="food-section-title-wrap">
                <h4 className="food-section-heading">{group.name}</h4>
                <span className={`section-req-pill ${group.required ? 'required' : 'optional'}`}>
                  {group.required ? 'Required (Pick 1)' : 'Optional'}
                </span>
              </div>

              <div className="custom-options-list">
                {group.options.map((option) => {
                  const isChecked = currentSelected.includes(option.name);

                  return (
                    <div
                      key={option.id}
                      className={`custom-option-item ${isChecked ? 'active' : ''}`}
                      onClick={() => {
                        if (group.type === 'single') {
                          handleSingleSelect(group.id, option.name);
                        } else {
                          handleMultiToggle(group.id, option.name);
                        }
                      }}
                    >
                      <div className="option-label-wrap">
                        <span
                          className={`custom-check-box ${group.type === 'single' ? 'round' : 'square'} ${
                            isChecked ? 'checked' : ''
                          }`}
                        >
                          {isChecked && <CheckIcon size={12} />}
                        </span>
                        <span className="option-name">{option.name}</span>
                      </div>
                      <span className="option-price-tag">
                        {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Section: Special Instructions */}
        <div className="food-section-block">
          <h4 className="food-section-heading">Special Preparation Instructions</h4>
          <textarea
            className="food-instructions-textarea"
            placeholder="E.g., Extra dressing on the side, no fresh cilantro, light salt, food allergy precautions..."
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>
      </div>

      {/* Modal Sticky Footer with Live Price & Action */}
      <div className="food-modal-footer">
        <div className="food-qty-selector">
          <span className="qty-label">Quantity</span>
          <div className="qty-buttons-group">
            <button
              type="button"
              className="modal-qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <MinusIcon size={14} />
            </button>
            <span className="modal-qty-val">{quantity}</span>
            <button
              type="button"
              className="modal-qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              <PlusIcon size={14} />
            </button>
          </div>
        </div>

        <div className="food-footer-action-wrap">
          <div className="food-footer-pricing">
            <span className="unit-calc-label">
              ${unitPrice.toFixed(2)} ea × {quantity}
            </span>
            <span className="total-calc-price">${totalPrice.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="btn btn-cognac btn-lg food-add-btn"
            onClick={handleSave}
          >
            <span>{initialCartItem ? 'Update Order Item' : 'Add to Order'}</span>
            <span className="btn-price-pill">${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  isOpen,
  onClose,
  dish,
  initialCartItem,
  onSaveItem,
}) => {
  if (!isOpen || !dish) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <FoodDetailsModalContent
        key={`${dish.id}-${initialCartItem?.id || 'new'}`}
        dish={dish}
        initialCartItem={initialCartItem}
        onClose={onClose}
        onSaveItem={onSaveItem}
      />
    </div>
  );
};
