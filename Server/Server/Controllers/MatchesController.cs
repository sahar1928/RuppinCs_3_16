using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Web.Http;
using Server.Models;

namespace Server.Controllers
{
    public class MatchesController : ApiController
    {
        private readonly string connectionString; // Connection string to SQL Server

        public MatchesController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["DBConnectionString"].ConnectionString;
        }

        [HttpPost]
        public async Task<IHttpActionResult> CreateMatch(Match match)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Prepare the SQL statement
                    var query = "INSERT INTO Matches (EmployeeId, EmployerId) VALUES (@EmployeeId, @EmployerId); SELECT SCOPE_IDENTITY();";
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Set the parameter values
                        command.Parameters.AddWithValue("@EmployeeId", match.EmployeeId);
                        command.Parameters.AddWithValue("@EmployerId", match.EmployerId);

                        // Execute the command and retrieve the inserted match ID
                        var insertedId = await command.ExecuteScalarAsync();

                        // Set the inserted ID to the match object
                        match.Id = Convert.ToInt32(insertedId);
                    }
                }

                return Ok(match);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetMatch(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Prepare the SQL statement
                    var query = "SELECT * FROM Matches WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Set the parameter value
                        command.Parameters.AddWithValue("@Id", id);

                        // Execute the command and retrieve the match
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            // Check if the match exists
                            if (reader.Read())
                            {
                                // Map the database record to a Match object
                                var match = new Match
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                                    EmployerId = Convert.ToInt32(reader["EmployerId"])
                                };

                                return Ok(match);
                            }
                            else
                            {
                                return NotFound();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> UpdateMatch(int id, Match match)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Prepare the SQL statement
                    var query = "UPDATE Matches SET EmployeeId = @EmployeeId, EmployerId = @EmployerId WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Set the parameter values
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@EmployeeId", match.EmployeeId);
                        command.Parameters.AddWithValue("@EmployerId", match.EmployerId);

                        // Execute the command and get the number of affected rows
                        var rowsAffected = await command.ExecuteNonQueryAsync();

                        // If no rows were affected, it means the match does not exist
                        if (rowsAffected == 0)
                        {
                            return NotFound();
                        }
                    }
                }

                // Return the updated match
                return Ok(match);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        public async Task<IHttpActionResult> DeleteMatch(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Prepare the SQL statement
                    var query = "DELETE FROM Matches WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Set the parameter value
                        command.Parameters.AddWithValue("@Id", id);

                        // Execute the command and get the number of affected rows
                        var rowsAffected = await command.ExecuteNonQueryAsync();

                        // If no rows were affected, it means the match does not exist
                        if (rowsAffected == 0)
                        {
                            return NotFound();
                        }
                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
