namespace PDFManagementApp.Dto
{
    public class FaceInfoDto
    {
        public int ID { get; set; }

        public int X { get; set; }

        public int Y { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public string Name { get; set; } //UserInstanceId

        public double Similarity { get; set; }
    }
    public class FacesData
    {
        public int Page { get; set; }
        public int PageWidth { get; set; }
        public int PageHeight { get; set; }
        public List<FaceInfoDto> Faces { get; set; }
    }
}
