using Microsoft.EntityFrameworkCore.Migrations;

namespace YoutubeDLView.Data.Migrations
{
    public partial class Addedvideopath : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Videos",
                newName: "VideoId");

            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "Videos",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Path",
                table: "Videos");

            migrationBuilder.RenameColumn(
                name: "VideoId",
                table: "Videos",
                newName: "Id");
        }
    }
}
