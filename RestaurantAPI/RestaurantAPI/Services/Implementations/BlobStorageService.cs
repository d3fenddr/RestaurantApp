using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using RestaurantAPI.Services.Interfaces;

namespace RestaurantAPI.Services.Implementations
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly IConfiguration _configuration;

        public BlobStorageService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string containerName)
        {
            var connectionString = _configuration["AzureBlobStorage:ConnectionString"];
            var container = new BlobContainerClient(connectionString, containerName);
            await container.CreateIfNotExistsAsync();
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var blob = container.GetBlobClient(fileName);

            using var stream = file.OpenReadStream();
            await blob.UploadAsync(stream, overwrite: true);

            return blob.Uri.ToString();
        }
        public async Task DeleteFileAsync(string fileUrl, string containerName)
        {
            var connectionString = _configuration["AzureBlobStorage:ConnectionString"];
            var container = new BlobContainerClient(connectionString, containerName);
            await container.CreateIfNotExistsAsync();

            var fileName = Path.GetFileName(new Uri(fileUrl).LocalPath);
            var blobClient = container.GetBlobClient(fileName);
            await blobClient.DeleteIfExistsAsync();
        }

    }
}
