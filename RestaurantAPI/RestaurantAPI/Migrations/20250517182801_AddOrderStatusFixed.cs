using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestaurantAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderStatusFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Добавляем только Status в Orders
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Pending");

            // Эти поля в Dishes добавляем только если они ещё НЕ были добавлены вручную ранее
            // УБЕДИСЬ, что их НЕТ в таблице перед добавлением ниже

            // migrationBuilder.AddColumn<string>(
            //     name: "NameAz",
            //     table: "Dishes",
            //     type: "nvarchar(max)",
            //     nullable: false,
            //     defaultValue: "");

            // migrationBuilder.AddColumn<string>(
            //     name: "DescriptionAz",
            //     table: "Dishes",
            //     type: "nvarchar(max)",
            //     nullable: false,
            //     defaultValue: "");

            // migrationBuilder.AddColumn<string>(
            //     name: "DescriptionEn",
            //     table: "Dishes",
            //     type: "nvarchar(max)",
            //     nullable: false,
            //     defaultValue: "");

            // migrationBuilder.AddColumn<string>(
            //     name: "DescriptionRu",
            //     table: "Dishes",
            //     type: "nvarchar(max)",
            //     nullable: false,
            //     defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Orders");

            // migrationBuilder.DropColumn(name: "NameAz", table: "Dishes");
            // migrationBuilder.DropColumn(name: "DescriptionAz", table: "Dishes");
            // migrationBuilder.DropColumn(name: "DescriptionEn", table: "Dishes");
            // migrationBuilder.DropColumn(name: "DescriptionRu", table: "Dishes");
        }
    }
}
