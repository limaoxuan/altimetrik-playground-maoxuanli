package com.max.controller;

import com.max.SearchBO;
import com.max.service.SearchService;
import com.max.utils.JSONResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(value = "search", tags = "search")
@RequestMapping("search")
@RestController
public class SearchController extends BasicController {

    @Autowired
    private SearchService searchService;

    @ApiOperation(value = "search college", notes = "search college")
    @PostMapping("/")
    public JSONResult search(@RequestBody SearchBO searchBO) {

        System.out.println(searchBO.getPageIndex());
        if (searchBO.getPageSize() == null || searchBO.getPageSize() == 0) {
            searchBO.setPageSize(PAGE_SIZE);
        }
        JSONResult jsonResult = checkSearchParams(searchBO);
        if (jsonResult.getStatus() != 200) {
            return jsonResult;
        }
        String res = searchService.searchCollegeByCriteria(searchBO);
        return JSONResult.ok(res);
    }

    private JSONResult checkSearchParams(SearchBO searchBO) {
        String zip = searchBO.getZipCode();
        if (StringUtils.isBlank(zip)) {
            return JSONResult.errorMsg("zip is empty");
        }

        Integer distance = searchBO.getDistance();
        if (distance == null) {
            return JSONResult.errorMsg("distance is empty");
        }

        String predominant = searchBO.getPredominant();
        if (StringUtils.isBlank(predominant)) {
            return JSONResult.errorMsg("predominant is empty");
        }

        String year = searchBO.getYear();
        if (StringUtils.isBlank(year)) {
            return JSONResult.errorMsg("year is empty");
        }


        return JSONResult.ok();
    }
}
