class AddWorkTypeToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :projects, :work_type, :string, default: 'development'
    # Add an index if you plan to query by work_type
    add_index :projects, :work_type
  end
end