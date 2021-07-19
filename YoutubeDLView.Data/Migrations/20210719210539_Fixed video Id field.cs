using Microsoft.EntityFrameworkCore.Migrations;

namespace YoutubeDLView.Data.Migrations
{
    public partial class FixedvideoIdfield : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VideoId",
                table: "Videos",
                newName: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Videos",
                newName: "VideoId");
        }
    }
}
