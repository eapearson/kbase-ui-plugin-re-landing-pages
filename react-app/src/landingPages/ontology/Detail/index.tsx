import React from 'react';
import { FlexTabs } from '@kbase/ui-components';
import './style.css';
import { OntologyTerm, Synonym } from '../../../types/ontology';
import TermLink from '../TermLink';
import LinkedObjects from './LinkedObjects';

export interface DetailProps {
    term: OntologyTerm
}

interface DetailState {

}

export default class Detail extends React.Component<DetailProps, DetailState> {
    renderSynonyms(synonyms: Array<Synonym>) {
        if (synonyms.length === 0) {
            return <i>-</i>;
        }
        return synonyms.map((s, index) => {
            return (
                <div key={String(index)}>
                    {s}
                </div>
            )
        });
    }
    renderDetail() {
        return (
            <div className="InfoTable DetailTable">
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        ID
                    </div>
                    <div className="InfoTable-dataCol">
                        <TermLink term={this.props.term} newWindow={true} />
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        Name
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.props.term.name}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        Definition
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.props.term.definition}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        Comment
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.props.term.comment || <i>-</i>}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        Synonyms
                    </div>
                    <div className="InfoTable-dataCol">

                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol">
                                exact
                                </div>
                            <div className="InfoTable-dataCol">
                                {this.renderSynonyms(this.props.term.synonyms.exact)}
                            </div>
                        </div>

                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol">
                                narrow
                                </div>
                            <div className="InfoTable-dataCol">
                                {this.renderSynonyms(this.props.term.synonyms.narrow)}
                            </div>
                        </div>
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol">
                                broad
                                </div>
                            <div className="InfoTable-dataCol">
                                {this.renderSynonyms(this.props.term.synonyms.broad)}
                            </div>
                        </div>
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol">
                                related
                                </div>
                            <div className="InfoTable-dataCol">
                                {this.renderSynonyms(this.props.term.synonyms.broad)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderGraph() {
        return (
            <div>
                graph here...
            </div>
        )
    }
    renderLinkedObjects() {

        return (
            <LinkedObjects termRef={this.props.term.ref} />
        )
    }
    renderMetadata() {
        return (
            <div>
                render metadata here...
            </div>
        )
    }

    render() {
        const tabs = [
            {
                tab: 'detail',
                title: 'Detail',
                component: this.renderDetail()
            },
            // {
            //     tab: 'graph',
            //     title: 'Graph',
            //     component: this.renderGraph()
            // },
            {
                tab: 'linked',
                title: 'Linked Objects',
                component: this.renderLinkedObjects()
            },
            // {
            //     tab: 'metadata',
            //     title: 'Metadata',
            //     component: this.renderMetadata()
            // }
        ]
        return (
            <FlexTabs tabs={tabs} />
        )
    }
}