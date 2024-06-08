package com.example.accessingdatamysql;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Controller // This means that this class is a Controller
@RequestMapping(path = "/materials")
public class MaterialsController {
	@Autowired // This means to get the bean called userRepository
	// Which is auto-generated by Spring, we will use it to handle the data
	private MaterialsRepository materialsRepository;

	@PostMapping(path = "/add") // Map ONLY POST Requests
	public @ResponseBody String addNewMaterial(@RequestParam String name, @RequestParam Integer price,
			@RequestParam String unit, @RequestParam String unit_sign) {
		// @ResponseBody means the returned String is the response, not a view name
		// @RequestParam means it is a parameter from the GET or POST request

		Materials material = new Materials();
		material.setName(name);
		material.setPrice(price);
		material.setUnit(unit);
		material.setUnitSign(unit_sign);
		materialsRepository.save(material);
		return "Saved";
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@GetMapping(path = "/all")
	public @ResponseBody ObjectNode getAllMaterials() {
		// JSONObject json = new JSONObject();
		// // This returns a JSON or XML with the users
		// return materialsRepository.findAll();
		final ObjectMapper mapper = new ObjectMapper();
		final ObjectNode root = mapper.createObjectNode();
		root.set("response_status", mapper.convertValue("success", JsonNode.class));
		root.set("response_code", mapper.convertValue(200, JsonNode.class));
		root.set("error_type", mapper.convertValue("none", JsonNode.class));
		root.set("stack_trace", mapper.convertValue("", JsonNode.class));

		Instant instant = Instant.now();
		long timeStampMillis = instant.toEpochMilli();

		root.set("timestamp", mapper.convertValue(timeStampMillis, JsonNode.class));
		root.set("data", mapper.convertValue(materialsRepository.findAll(), JsonNode.class));
		root.set("success", mapper.convertValue(true, JsonNode.class));
		return root;
	}
}