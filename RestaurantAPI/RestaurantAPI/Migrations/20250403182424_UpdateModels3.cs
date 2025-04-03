using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestaurantAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dishes_Categories_CategoryId",
                table: "Dishes");

            migrationBuilder.RenameColumn(
                name: "TotalPrice",
                table: "Orders",
                newName: "Total");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Dishes",
                newName: "DishCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Dishes_CategoryId",
                table: "Dishes",
                newName: "IX_Dishes_DishCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dishes_Categories_DishCategoryId",
                table: "Dishes",
                column: "DishCategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dishes_Categories_DishCategoryId",
                table: "Dishes");

            migrationBuilder.RenameColumn(
                name: "Total",
                table: "Orders",
                newName: "TotalPrice");

            migrationBuilder.RenameColumn(
                name: "DishCategoryId",
                table: "Dishes",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Dishes_DishCategoryId",
                table: "Dishes",
                newName: "IX_Dishes_CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dishes_Categories_CategoryId",
                table: "Dishes",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
