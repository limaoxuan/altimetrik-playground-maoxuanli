package com.max.service.impl;

import com.max.SearchBO;
import com.max.service.SearchService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;



@Service
public class SearchServiceIml implements SearchService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${api-key}")
    private String apiKey;

    @Value("${api-url}")
    private String apiUrl;


    /**
     * @param searchBO
     * @return
     */
    @Override
    public String searchCollegeByCriteria(SearchBO searchBO) {


        String url = getUrl(searchBO);
        return restTemplate.getForObject(url,
                String.class);
    }


    private String getUrl(SearchBO searchBO) {
        StringBuilder res = new StringBuilder();
        res.append(apiUrl);
        if (!StringUtils.isBlank(searchBO.getPredominant())) {
            res.append("school.degrees_awarded.predominant=");
            res.append(searchBO.getPredominant());
            res.append("&");
        }

        if (!StringUtils.isBlank(searchBO.getYear())) {
            res.append("fields=id,school.name,");
            res.append(searchBO.getYear() + ".student.size");
            res.append("&");
        }

        if (!StringUtils.isBlank(searchBO.getZipCode())) {
            res.append("zip=");
            res.append(searchBO.getZipCode());
            res.append("&");
        }

        if (searchBO.getDistance() != null && !StringUtils.isBlank(searchBO.getZipCode())) {
            res.append("distance=");
            res.append(searchBO.getDistance()+"mi");
            res.append("&");
        }

        res.append("page=");
        res.append(searchBO.getPageIndex());
        res.append("&");

        res.append("per_page=");
        res.append(searchBO.getPageSize());
        res.append("&");

        res.append("api_key=");
        res.append(apiKey);

        System.out.println(res.toString());
        return res.toString();
    }

}
