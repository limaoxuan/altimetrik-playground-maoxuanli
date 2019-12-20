package com.max;

import lombok.Data;

@Data
public class SearchBO {
    private String zipCode;
    private Integer distance;
    private String predominant;
    private String year;
    private Integer pageSize;
    private Integer pageIndex;

}
