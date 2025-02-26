class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :title
      t.boolean :project_done
      t.float :work_amount
      t.float :work_logged

      t.timestamps
    end
  end
end
