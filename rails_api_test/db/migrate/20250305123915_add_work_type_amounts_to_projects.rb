class AddWorkTypeAmountsToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :projects, :work_amount_development, :float, default: 0.0
    add_column :projects, :work_amount_design, :float, default: 0.0
    add_column :projects, :work_amount_research, :float, default: 0.0
    add_column :projects, :work_amount_other, :float, default: 0.0
    add_column :projects, :work_amount_total, :float, default: 0.0
    
    # Add indexes for better query performance
    add_index :projects, :work_amount_development
    add_index :projects, :work_amount_design
    add_index :projects, :work_amount_research
    add_index :projects, :work_amount_other
    add_index :projects, :work_amount_total
  end
end