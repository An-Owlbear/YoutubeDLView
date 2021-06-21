using Microsoft.EntityFrameworkCore.Migrations;

namespace YoutubeDLView.Data.Migrations
{
    public partial class Added_user_refresh_key : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RefreshKey",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshKey",
                table: "Users");
        }
    }
}
