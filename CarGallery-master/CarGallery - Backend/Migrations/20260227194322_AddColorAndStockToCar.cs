using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarGallery.Migrations
{
    /// <inheritdoc />
    public partial class AddColorAndStockToCar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Cars",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrls",
                table: "Cars",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "Cars",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "ImageUrls",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "Stock",
                table: "Cars");
        }
    }
}
