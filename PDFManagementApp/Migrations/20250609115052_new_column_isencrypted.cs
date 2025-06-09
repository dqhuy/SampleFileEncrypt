using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PDFManagementApp.Migrations
{
    public partial class new_column_isencrypted : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEncrypted",
                table: "Documents",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEncrypted",
                table: "Documents");
        }
    }
}
