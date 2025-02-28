class Project < ApplicationRecord
  validates :title, presence: true
  validates :work_amount, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :work_logged, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :work_type, inclusion: { 
    in: %w(development design research other),
    message: "%{value} is not a valid work type" 
  }
end
