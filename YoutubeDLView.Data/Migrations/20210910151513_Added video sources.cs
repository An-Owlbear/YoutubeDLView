using Microsoft.EntityFrameworkCore.Migrations;

namespace YoutubeDLView.Data.Migrations
{
    public partial class Addedvideosources : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VideoSources",
                columns: table => new
                {
                    Path = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideoSources", x => x.Path);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VideoSources");
        }
    }
}
