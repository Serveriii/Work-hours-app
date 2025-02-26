class Project < ApplicationRecord
  validates :title, presence: true
  validates :work_amount, numericality: { greater_than_or_equal_to: 0 }
  validates :work_logged, numericality: { greater_than_or_equal_to: 0 }
end
