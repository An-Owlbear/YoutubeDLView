using Microsoft.EntityFrameworkCore.Migrations;

namespace YoutubeDLView.Data.Migrations
{
    public partial class Addeduploaddate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UploadDate",
                table: "Videos",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UploadDate",
                table: "Videos");
        }
    }
}
