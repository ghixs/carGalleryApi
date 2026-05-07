using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarGallery.Migrations
{
    /// <inheritdoc />
    public partial class AddGallerySystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GalleryId",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GalleryId",
                table: "Brands",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Galleries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    Phone = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    LogoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreateUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdateUserId = table.Column<int>(type: "INTEGER", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Galleries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_GalleryId",
                table: "Users",
                column: "GalleryId");

            migrationBuilder.CreateIndex(
                name: "IX_Brands_GalleryId",
                table: "Brands",
                column: "GalleryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Brands_Galleries_GalleryId",
                table: "Brands",
                column: "GalleryId",
                principalTable: "Galleries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Galleries_GalleryId",
                table: "Users",
                column: "GalleryId",
                principalTable: "Galleries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Brands_Galleries_GalleryId",
                table: "Brands");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Galleries_GalleryId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Galleries");

            migrationBuilder.DropIndex(
                name: "IX_Users_GalleryId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Brands_GalleryId",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "GalleryId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GalleryId",
                table: "Brands");
        }
    }
}
