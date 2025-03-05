class Project < ApplicationRecord
  validates :title, presence: true
  validates :work_amount_development, :work_amount_design, :work_amount_research, :work_amount_other, :work_amount_total,
            numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  before_save :update_total_work_amount

  private

  def update_total_work_amount
    self.work_amount_total = [
      work_amount_development,
      work_amount_design,
      work_amount_research,
      work_amount_other
    ].compact.sum
  end
end