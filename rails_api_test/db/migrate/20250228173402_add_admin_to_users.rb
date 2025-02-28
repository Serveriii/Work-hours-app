class AddAdminToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :admin, :boolean, default: false
    add_index :users, :admin  # Add index for better query performance
  end
end