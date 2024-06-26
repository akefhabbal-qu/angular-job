package com.example.accessingdatamysql;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Controller // This means that this class is a Controller
@RequestMapping(path = "/user") // This means URL's start with /demo (after Application path)
public class UserController {
	@Autowired // This means to get the bean called userRepository
	// Which is auto-generated by Spring, we will use it to handle the data
	private UserRepository userRepository;

	@PostMapping(path = "/add") // Map ONLY POST Requests
	public @ResponseBody String addNewUser(@RequestParam String name, @RequestParam String email,
			@RequestParam String password) {
		// @ResponseBody means the returned String is the response, not a view name
		// @RequestParam means it is a parameter from the GET or POST request

		User n = new User();
		n.setName(name);
		n.setEmail(email);
		n.setPassword(password);
		userRepository.save(n);
		return "Saved";
	}

	@GetMapping(path = "/all")
	public @ResponseBody Iterable<User> getAllUsers() {
		// This returns a JSON or XML with the users
		return userRepository.findAll();
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@GetMapping(path = "/data")
	public @ResponseBody ObjectNode getUser(@RequestParam String email) {

		final ObjectMapper mapper = new ObjectMapper();
		final ObjectNode root = mapper.createObjectNode();
		root.set("response_status", mapper.convertValue("success", JsonNode.class));
		root.set("response_code", mapper.convertValue(200, JsonNode.class));
		root.set("error_type", mapper.convertValue("none", JsonNode.class));
		root.set("stack_trace", mapper.convertValue("", JsonNode.class));

		Instant instant = Instant.now();
		long timeStampMillis = instant.toEpochMilli();

		root.set("timestamp", mapper.convertValue(timeStampMillis, JsonNode.class));

		final ObjectMapper mapper2 = new ObjectMapper();
		final ObjectNode root2 = mapper2.createObjectNode();
		root2.set("name", mapper.convertValue("John Doe", JsonNode.class));
		root2.set("email", mapper.convertValue("akef@gmail.com", JsonNode.class));

		root.set("data", mapper.convertValue(root2, JsonNode.class));
		root.set("success", mapper.convertValue(true, JsonNode.class));
		return root;
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping(path = "/login")
	public @ResponseBody ObjectNode login(@RequestBody UserData userLogin) {
		try {
			// User user = userRepository.findByEmail(userLogin.getEmail());
			// if (userLogin.getPassword().equals(user.getPassword())) {
			final ObjectMapper mapper = new ObjectMapper();
			final ObjectNode root = mapper.createObjectNode();
			root.set("response_status", mapper.convertValue("success", JsonNode.class));
			root.set("response_code", mapper.convertValue(200, JsonNode.class));
			root.set("error_type", mapper.convertValue("none", JsonNode.class));
			root.set("stack_trace", mapper.convertValue("", JsonNode.class));

			Instant instant = Instant.now();
			long timeStampMillis = instant.toEpochMilli();

			final String token = "Bearer " + timeStampMillis;

			root.set("timestamp", mapper.convertValue(timeStampMillis, JsonNode.class));
			root.set("data", mapper.convertValue(token, JsonNode.class));
			root.set("success", mapper.convertValue(true, JsonNode.class));
			return root;
			// } else {
			// final ObjectMapper mapper = new ObjectMapper();
			// final ObjectNode root = mapper.createObjectNode();
			// root.set("response_status", mapper.convertValue("error", JsonNode.class));
			// root.set("response_code", mapper.convertValue(401, JsonNode.class));
			// root.set("error_type", mapper.convertValue("invalid_credentials",
			// JsonNode.class));
			// root.set("stack_trace", mapper.convertValue("", JsonNode.class));
			// root.set("timestamp", mapper.convertValue(Instant.now().toEpochMilli(),
			// JsonNode.class));
			// root.set("data", mapper.convertValue("", JsonNode.class));
			// root.set("success", mapper.convertValue(false, JsonNode.class));
			// return root;
			// }
		} catch (Exception e) {
			final ObjectMapper mapper = new ObjectMapper();
			final ObjectNode root = mapper.createObjectNode();
			root.set("response_status", mapper.convertValue("error", JsonNode.class));
			root.set("response_code", mapper.convertValue(500, JsonNode.class));
			root.set("error_type", mapper.convertValue("some error", JsonNode.class));
			root.set("stack_trace", mapper.convertValue(e.getStackTrace(), JsonNode.class));
			root.set("timestamp", mapper.convertValue(Instant.now().toEpochMilli(), JsonNode.class));
			root.set("data", mapper.convertValue("", JsonNode.class));
			root.set("success", mapper.convertValue(false, JsonNode.class));
			return root;
		}

	}
}
